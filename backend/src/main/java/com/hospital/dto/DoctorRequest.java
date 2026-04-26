package com.hospital.dto;

import lombok.Data;

@Data
public class DoctorRequest {
    private String email;
    private String password;
    private String name;
    private String specialization;
    private Integer experienceYears;
    private String availability;
}
