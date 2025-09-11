/*
 * @ (#) Endpoints.java       1.0     07/06/2024
 *
 * Copyright (c) 2024 IUH. All rights reserved.
 */

package vn.edu.iuh.fit.backend.security;
/*
 * @description:
 * @author: Nguyen Thanh Nhut
 * @date: 07/06/2024
 * @version:    1.0
 */

import org.springframework.beans.factory.annotation.Value;

public class Endpoints {
    public static final String[] PUBLIC_GET_ENDPOINTS = {
            "/v2/api-docs",
            "/v3/api-docs",
            "/v3/api-docs/**",
            "/swagger-resources",
            "/swagger-sources/**",
            "/configuration/ui",
            "/configuration/security",
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/webjars/**",
            "/error"
    };

    public static final String[] PUBLIC_POST_ENDPOINTS = {
            "/api/auth/register",
            "/api/auth/login",
    };

    public static final String[] ADMIN_GET_ENDPOINTS = {
            "/api/users",
            "/api/users/**",
    };

    public static final String[] ADMIN_DELETE_ENDPOINTS = {
            "/api/users/**"
    };

    public static final String[] USER_GET_ENDPOINTS = {
            "/api/users/me"
    };
}

