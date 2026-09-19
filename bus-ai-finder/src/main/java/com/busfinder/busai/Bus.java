package com.busfinder.busai;

public class Bus {

    private String source;
    private String destination;
    private String departureTime;
    private String busType;

    public Bus(String source, String destination,
               String departureTime, String busType) {

        this.source = source;
        this.destination = destination;
        this.departureTime = departureTime;
        this.busType = busType;
    }

    public String getSource() {
        return source;
    }

    public String getDestination() {
        return destination;
    }

    public String getDepartureTime() {
        return departureTime;
    }

    public String getBusType() {
        return busType;
    }
}