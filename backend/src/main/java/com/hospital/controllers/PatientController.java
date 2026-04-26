package com.hospital.controllers;

import com.hospital.dto.PatientRequest;
import com.hospital.entities.Patient;
import com.hospital.services.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.util.List;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @PostMapping
    // @PreAuthorize("hasAnyRole('ADMIN', 'PATIENT')") // Disabling for demo registration
    public ResponseEntity<Patient> createPatient(@RequestBody PatientRequest request) {
        return ResponseEntity.ok(patientService.createPatient(request));
    }

    @GetMapping
    public ResponseEntity<Page<Patient>> getAllPatients(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(patientService.getAllPatients(pageable));
    }
}
