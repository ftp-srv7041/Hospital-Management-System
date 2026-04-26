package com.hospital.dto;

import lombok.Data;

@Data
public class PatientRequest {
    private String email;
    private String password;
    private String name;
    private Integer age;
    private String contactNumber;
    private String address;
}
