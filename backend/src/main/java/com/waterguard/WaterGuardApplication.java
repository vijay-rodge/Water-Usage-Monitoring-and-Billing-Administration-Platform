package com.waterguard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class WaterGuardApplication {
    public static void main(String[] args) {
        SpringApplication.run(WaterGuardApplication.class, args);
    }
}
