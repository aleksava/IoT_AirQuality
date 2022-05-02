package com.ntnu.backend.models.entities.user;

import javax.persistence.*;

@Entity
@Table(name = "base_user")
public class BaseUser {

    public enum UserType {
        ReadOnlyUser(0), ReadWriteUser(1);
        private final int id;
        UserType(int id) {
            this.id = (id < 0 || id > 1) ? 0 : id;
        }
        public int getId() {
            return id;
        }
    }

    @Id
    @Column(name="username", nullable = false)
    private String username;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "user_type", nullable = false)
    private UserType userType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_org", nullable = false)
    private Organization userOrg;

    public static BaseUser fromUsername(String username) {
        BaseUser toReturn = new BaseUser();
        toReturn.setUsername(username);
        return toReturn;
    }

    public BaseUser() {  }

    public BaseUser(String username, String email, UserType userType, Organization userOrg) {
        this.username = username;
        this.email = email;
        this.userType = userType;
        this.userOrg = userOrg;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public UserType getUserType() {
        return userType;
    }

    public void setUserType(UserType userType) {
        this.userType = userType;
    }

    public Organization getUserOrg() {
        return userOrg;
    }

    public void setUserOrg(Organization userOrg) {
        this.userOrg = userOrg;
    }
}
