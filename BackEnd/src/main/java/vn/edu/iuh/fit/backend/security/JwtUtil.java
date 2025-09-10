/*
 * @ (#) JwtService.java       1.0     10/09/2025
 *
 * Copyright (c) 2025 IUH. All rights reserved.
 */

package vn.edu.iuh.fit.backend.security;
/*
 * @description:
 * @author: Nguyen Thanh Nhut
 * @date: 10/09/2025
 * @version:    1.0
 */

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import vn.edu.iuh.fit.backend.model.Role;
import vn.edu.iuh.fit.backend.model.User;
import vn.edu.iuh.fit.backend.service.UserService;

import javax.crypto.SecretKey;
import java.util.*;
import java.util.function.Function;

@Service
public class JwtUtil {
    @Value("${jwt.secret}")
    private String SECRET_KEY;
    private final UserService userService;

    @Value("${jwt.expiration}")
    private long expiration;

    public JwtUtil(UserService userService) {
        this.userService = userService;
    }

    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        User user = userService.findByUsername(username);
        boolean isAdmin = false;
        boolean isUser = false;
        if (user != null && !user.getRoles().isEmpty()){
            Set<Role> roles = user.getRoles();
            for (Role role : roles) {
                if (role.getRoleName().equals("ADMIN")) {
                    isAdmin = true;
                }
                if (role.getRoleName().equals("USER")) {
                    isUser = true;
                }
            }
        }
        claims.put("isAdmin", isAdmin);
        claims.put("isUser", isUser);
        return createToken(claims, username);
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * expiration))
                .signWith(getSecretKey())
                .compact();
    }

    // Get secret key
    private SecretKey getSecretKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Get expiration
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    // Extract claims
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // Check expiration token
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Valid token
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}
