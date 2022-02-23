package com.ntnu.backend.models.responses;

public class ErrorMessage {

    //Room-related error messages reserved code 1-9
    public static final ErrorMessage ROOM_NOT_FOUND = new ErrorMessage(1, "The requested room was not found.");
    public static final ErrorMessage ROOM_NOT_IN_YOUR_ORGANIZATION = new ErrorMessage(2,"The room you are requesting is not connected to your organization.");

    //Device-related error messages reserved code 10-29
    public static final ErrorMessage DEVICE_NOT_FOUND = new ErrorMessage(10,"The requested device was not found.");
    public static final ErrorMessage DEVICE_NOT_IN_YOUR_ORGANIZATION = new ErrorMessage(10,"The device you are requesting is not connected to your organization.");
    public static final ErrorMessage DEVICE_DATA_START_MUST_BE_BEFORE_END = new ErrorMessage(11,"When requesting Device data, the lookback_end-param must be lower (later) than lookback_start.");
    public static final ErrorMessage DEVICE_DATA_LOOKBACK_TOO_LONG = new ErrorMessage(12,"For raw data, you can maximum look back 30 days (30*24 hrs).");

    private int code;
    private String description;

    public ErrorMessage(int code, String description) {
        this.code = code;
        this.description = description;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
