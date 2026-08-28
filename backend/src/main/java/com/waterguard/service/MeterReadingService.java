package com.waterguard.service;

import com.waterguard.dto.MeterReadingDto;
import com.waterguard.model.Alert;
import com.waterguard.model.Household;
import com.waterguard.model.MeterReading;
import com.waterguard.model.User;
import com.waterguard.repository.AlertRepository;
import com.waterguard.repository.HouseholdRepository;
import com.waterguard.repository.MeterReadingRepository;
import com.waterguard.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MeterReadingService {

    private final MeterReadingRepository meterReadingRepository;
    private final HouseholdRepository householdRepository;
    private final UserRepository userRepository;
    private final AlertRepository alertRepository;
    private final AnomalyDetectionService anomalyDetectionService;

    @Transactional
    public MeterReadingDto.ReadingResponse recordManualReading(MeterReadingDto.ReadingSubmitRequest request, String userEmail) {
        Household household = householdRepository.findById(request.getHouseholdId())
                .orElseThrow(() -> new IllegalArgumentException("Household not found with ID: " + request.getHouseholdId()));

        Optional<User> userOpt = userRepository.findByEmail(userEmail);

        Optional<MeterReading> lastReadingOpt = meterReadingRepository.findTopByHouseholdIdOrderByReadingDateDesc(household.getId());
        BigDecimal previousReading = lastReadingOpt.map(MeterReading::getCurrentReadingLiters)
                .orElse(household.getInitialMeterReading());

        BigDecimal consumption = request.getCurrentReadingLiters().subtract(previousReading);
        if (consumption.compareTo(BigDecimal.ZERO) < 0) {
            consumption = BigDecimal.ZERO;
        }

        AnomalyDetectionService.AnomalyResult anomalyResult = anomalyDetectionService.evaluateReading(
                household.getId(),
                request.getReadingDate(),
                consumption,
                previousReading,
                request.getCurrentReadingLiters()
        );

        MeterReading reading = MeterReading.builder()
                .household(household)
                .readingDate(request.getReadingDate())
                .previousReadingLiters(previousReading)
                .currentReadingLiters(request.getCurrentReadingLiters())
                .dailyConsumptionLiters(consumption)
                .logSource("MANUAL")
                .isAnomaly(anomalyResult.isAnomaly)
                .anomalyType(anomalyResult.anomalyType)
                .anomalyScore(anomalyResult.anomalyScore)
                .remarks(request.getRemarks() != null ? request.getRemarks() : anomalyResult.remarks)
                .recordedByUser(userOpt.orElse(null))
                .build();

        reading = meterReadingRepository.save(reading);

        if (anomalyResult.isAnomaly) {
            alertRepository.save(Alert.builder()
                    .apartment(household.getApartment())
                    .household(household)
                    .title("Water Anomaly Flagged - Flat " + household.getFlatNo())
                    .message(anomalyResult.remarks)
                    .alertType(anomalyResult.anomalyType)
                    .severity(anomalyResult.anomalyScore.compareTo(new BigDecimal("80.00")) >= 0 ? "CRITICAL" : "HIGH")
                    .isRead(false)
                    .isResolved(false)
                    .build());
        }

        return mapToResponse(reading);
    }

    public List<MeterReadingDto.ReadingResponse> getReadingsForHousehold(Long householdId) {
        return meterReadingRepository.findByHouseholdIdOrderByReadingDateDesc(householdId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public MeterReadingDto.BulkUploadResult processCsvUpload(MultipartFile file, Long apartmentId) {
        List<MeterReadingDto.CSVRowParsed> parsedRows = new ArrayList<>();
        int success = 0;
        int errors = 0;
        int anomalies = 0;

        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            boolean isHeader = true;

            while ((line = reader.readLine()) != null) {
                if (line.trim().isEmpty()) continue;
                if (isHeader) {
                    isHeader = false;
                    continue;
                }

                String[] cols = line.split(",");
                if (cols.length < 3) {
                    errors++;
                    continue;
                }

                String flatNo = cols[0].trim();
                String dateStr = cols[1].trim();
                String readingStr = cols[2].trim();

                try {
                    LocalDate readingDate = LocalDate.parse(dateStr, dtf);
                    BigDecimal currentReading = new BigDecimal(readingStr);

                    Optional<Household> householdOpt = householdRepository.findByApartmentIdAndFlatNo(apartmentId, flatNo);
                    if (householdOpt.isEmpty()) {
                        errors++;
                        continue;
                    }

                    Household household = householdOpt.get();
                    Optional<MeterReading> lastReadingOpt = meterReadingRepository.findTopByHouseholdIdOrderByReadingDateDesc(household.getId());
                    BigDecimal prevReading = lastReadingOpt.map(MeterReading::getCurrentReadingLiters).orElse(household.getInitialMeterReading());
                    BigDecimal consumption = currentReading.subtract(prevReading);
                    if (consumption.compareTo(BigDecimal.ZERO) < 0) consumption = BigDecimal.ZERO;

                    AnomalyDetectionService.AnomalyResult anomaly = anomalyDetectionService.evaluateReading(
                            household.getId(), readingDate, consumption, prevReading, currentReading
                    );

                    MeterReading reading = MeterReading.builder()
                            .household(household)
                            .readingDate(readingDate)
                            .previousReadingLiters(prevReading)
                            .currentReadingLiters(currentReading)
                            .dailyConsumptionLiters(consumption)
                            .logSource("CSV_UPLOAD")
                            .isAnomaly(anomaly.isAnomaly)
                            .anomalyType(anomaly.anomalyType)
                            .anomalyScore(anomaly.anomalyScore)
                            .remarks(anomaly.remarks)
                            .build();

                    meterReadingRepository.save(reading);

                    if (anomaly.isAnomaly) {
                        anomalies++;
                    }

                    parsedRows.add(MeterReadingDto.CSVRowParsed.builder()
                            .flatNo(flatNo)
                            .meterSerialNo(household.getMeterSerialNo())
                            .readingDate(readingDate)
                            .currentReadingLiters(currentReading)
                            .dailyConsumptionLiters(consumption)
                            .isAnomaly(anomaly.isAnomaly)
                            .anomalyReason(anomaly.remarks)
                            .isValid(true)
                            .build());

                    success++;
                } catch (Exception ex) {
                    errors++;
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Error processing CSV: " + e.getMessage(), e);
        }

        return MeterReadingDto.BulkUploadResult.builder()
                .totalProcessed(success + errors)
                .successCount(success)
                .errorCount(errors)
                .anomaliesDetected(anomalies)
                .rows(parsedRows)
                .build();
    }

    private MeterReadingDto.ReadingResponse mapToResponse(MeterReading r) {
        return MeterReadingDto.ReadingResponse.builder()
                .id(r.getId())
                .householdId(r.getHousehold().getId())
                .flatNo(r.getHousehold().getFlatNo())
                .readingDate(r.getReadingDate())
                .previousReadingLiters(r.getPreviousReadingLiters())
                .currentReadingLiters(r.getCurrentReadingLiters())
                .dailyConsumptionLiters(r.getDailyConsumptionLiters())
                .logSource(r.getLogSource())
                .isAnomaly(r.getIsAnomaly())
                .anomalyType(r.getAnomalyType())
                .anomalyScore(r.getAnomalyScore())
                .remarks(r.getRemarks())
                .build();
    }
}

