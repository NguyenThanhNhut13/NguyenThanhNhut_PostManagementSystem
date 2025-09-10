/*
 * @ (#) JwtResponse.java       1.0     08/06/2024
 *
 * Copyright (c) 2024 IUH. All rights reserved.
 */

package vn.edu.iuh.fit.backend.dto.response;
/*
 * @description:
 * @author: Nguyen Thanh Nhut
 * @date: 08/06/2024
 * @version:    1.0
 */

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String jwt;
}
