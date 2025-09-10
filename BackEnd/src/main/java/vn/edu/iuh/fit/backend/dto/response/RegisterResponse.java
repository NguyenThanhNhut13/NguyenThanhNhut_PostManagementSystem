/*
 * @ (#) RegisterResponse.java       1.0     10/09/2025
 *
 * Copyright (c) 2025 IUH. All rights reserved.
 */

package vn.edu.iuh.fit.backend.dto.response;
/*
 * @description:
 * @author: Nguyen Thanh Nhut
 * @date: 10/09/2025
 * @version:    1.0
 */

import lombok.*;

import java.util.Set;

@Data
@Builder
@AllArgsConstructor
public class RegisterResponse {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private char gender;
    private Set<String> roles;
}
