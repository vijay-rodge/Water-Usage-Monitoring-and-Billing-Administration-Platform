package com.waterguard.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class JwtUtils {

    @Value("${JWT_SECRET:${app.jwt.secret:404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}}")
    private String jwtSecret;

    @Value("${JWT_EXPIRES_IN_MS:${app.jwt.expiration-ms:900000}}") // Default 15 minutes (900,000 ms)
    private long jwtExpirationMs;

    public static final String COOKIE_NAME = "jwt";

    private SecretKey getSigningKey() {
        byte[] keyBytes = this.jwtSecret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            byte[] padded = new byte[32];
            System.arraycopy(keyBytes, 0, padded, 0, keyBytes.length);
            return Keys.hmacShaKeyFor(padded);
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateJwtToken(Long userId, String email, Long communityId, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("communityId", communityId);
        claims.put("role", role != null ? role.replace("ROLE_", "") : "RESIDENT");

        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getSigningKey(), Jwts.SIG.HS256)
                .compact();
    }

    public Claims getClaimsFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String getEmailFromJwtToken(String token) {
        return getClaimsFromToken(token).getSubject();
    }

    public Long getUserIdFromJwtToken(String token) {
        Object val = getClaimsFromToken(token).get("userId");
        if (val instanceof Number num) {
            return num.longValue();
        }
        return null;
    }

    public Long getCommunityIdFromJwtToken(String token) {
        Object val = getClaimsFromToken(token).get("communityId");
        if (val instanceof Number num) {
            return num.longValue();
        }
        return null;
    }

    public String getRoleFromJwtToken(String token) {
        Object val = getClaimsFromToken(token).get("role");
        return val != null ? val.toString() : null;
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(authToken);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.warn("Invalid or expired JWT token: {}", e.getMessage());
        }
        return false;
    }

    public ResponseCookie createJwtCookie(String token) {
        return ResponseCookie.from(COOKIE_NAME, token)
                .path("/")
                .maxAge(jwtExpirationMs / 1000)
                .httpOnly(true)
                .secure(false) // Set to true in production with HTTPS
                .sameSite("Lax")
                .build();
    }

    public ResponseCookie createCleanJwtCookie() {
        return ResponseCookie.from(COOKIE_NAME, "")
                .path("/")
                .maxAge(0)
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .build();
    }

    public String getJwtFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (COOKIE_NAME.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
