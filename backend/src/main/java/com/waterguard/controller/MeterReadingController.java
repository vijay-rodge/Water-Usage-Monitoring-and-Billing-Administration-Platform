package com.waterguard.controller;

import com.waterguard.dto.MeterReadingDto;
import com.waterguard.service.MeterReadingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/meter-readings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class MeterReadingController {

    private final MeterReadingService meterReadingService;

    @PostMapping("/manual")
    public ResponseEntity<MeterReadingDto.ReadingResponse> recordReading(
            @Valid @RequestBody MeterReadingDto.ReadingSubmitRequest request,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : "system";
        return ResponseEntity.ok(meterReadingService.recordManualReading(request, email));
    }

    @GetMapping("/household/{householdId}")
    public ResponseEntity<List<MeterReadingDto.ReadingResponse>> getHouseholdReadings(@PathVariable Long householdId) {
        return ResponseEntity.ok(meterReadingService.getReadingsForHousehold(householdId));
    }

    @PostMapping("/upload-csv")
    public ResponseEntity<MeterReadingDto.BulkUploadResult> uploadCsv(
            @RequestParam("file") MultipartFile file,
            @RequestParam("apartmentId") Long apartmentId
    ) {
        return ResponseEntity.ok(meterReadingService.processCsvUpload(file, apartmentId));
    }
}
