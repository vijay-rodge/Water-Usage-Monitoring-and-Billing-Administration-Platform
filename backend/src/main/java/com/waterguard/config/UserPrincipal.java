package com.waterguard.config;

import com.waterguard.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Getter
@AllArgsConstructor
@Builder
public class UserPrincipal implements UserDetails {

    private final Long userId;
    private final String email;
    private final String fullName;
    private final String password;
    private final Long communityId;
    private final String communityName;
    private final Long householdId;
    private final String flatNo;
    private final String role;
    private final boolean active;
    private final Collection<? extends GrantedAuthority> authorities;

    public static UserPrincipal build(User user) {
        String roleStr = user.getRole() != null ? user.getRole() : "RESIDENT";
        String normalizedRole = roleStr.replace("ROLE_", "").toUpperCase();

        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(normalizedRole));
        authorities.add(new SimpleGrantedAuthority("ROLE_" + normalizedRole));

        Long communityId = user.getApartment() != null ? user.getApartment().getId() : null;
        String communityName = user.getApartment() != null ? user.getApartment().getName() : null;
        Long householdId = user.getHousehold() != null ? user.getHousehold().getId() : null;
        String flatNo = user.getHousehold() != null ? user.getHousehold().getFlatNo() : null;

        return UserPrincipal.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .password(user.getPasswordHash())
                .communityId(communityId)
                .communityName(communityName)
                .householdId(householdId)
                .flatNo(flatNo)
                .role(normalizedRole)
                .active(user.getIsActive() != null ? user.getIsActive() : true)
                .authorities(authorities)
                .build();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }
}

