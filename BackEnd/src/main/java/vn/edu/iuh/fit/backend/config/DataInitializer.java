/*
 * @ (#) DataInitializer.java       1.0     10/09/2025
 *
 * Copyright (c) 2025 IUH. All rights reserved.
 */

package vn.edu.iuh.fit.backend.config;
/*
 * @description:
 * @author: Nguyen Thanh Nhut
 * @date: 10/09/2025
 * @version:    1.0
 */

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import vn.edu.iuh.fit.backend.model.Role;
import vn.edu.iuh.fit.backend.repository.RoleRepository;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) {
        List<String> roles = List.of("ROLE_USER", "ROLE_ADMIN");
        for (String roleName : roles) {
            roleRepository.findByRoleName(roleName)
                    .orElseGet(() -> roleRepository.save(new Role(roleName)));
        }
    }
}
