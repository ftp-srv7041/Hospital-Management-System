package com.hospital.services;

import com.hospital.dto.PatientRequest;
import com.hospital.entities.Patient;
import com.hospital.entities.User;
import com.hospital.enums.Role;
import com.hospital.repositories.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public Patient createPatient(PatientRequest request) {
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.PATIENT)
                .build();

        Patient patient = Patient.builder()
                .user(user)
                .name(request.getName())
                .age(request.getAge())
                .contactNumber(request.getContactNumber())
                .address(request.getAddress())
                .build();

        return patientRepository.save(patient);
    }

    public Page<Patient> getAllPatients(Pageable pageable) {
        return patientRepository.findAll(pageable);
    }
}
