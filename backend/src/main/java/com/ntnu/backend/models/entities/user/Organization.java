package com.ntnu.backend.models.entities.user;

import javax.persistence.*;

@Entity
@Table(name = "organization")
public class Organization {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Access(AccessType.PROPERTY)
    private long id;

    @Column(name = "org_name")
    private String orgName;

    public static Organization fromId(long id){
        Organization toReturn = new Organization();
        toReturn.setId(id);
        return toReturn;
    }

    public Organization() {  }

    public Organization(long id, String orgName) {
        this.id = id;
        this.orgName = orgName;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getOrgName() {
        return orgName;
    }

    public void setOrgName(String orgName) {
        this.orgName = orgName;
    }
}
