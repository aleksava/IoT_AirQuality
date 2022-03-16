package com.ntnu.backend.DAO._influx;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.InfluxDBClientFactory;
import com.influxdb.query.FluxRecord;
import com.influxdb.query.FluxTable;
import com.ntnu.backend.models.responses.devices.DeviceDataPoint;
import com.ntnu.backend.models.responses.devices.DeviceDataTable;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class DeviceDataRepository {

    private final String org;
    private final String url;
    private final String token;

    public DeviceDataRepository(@Value("${influxdb.org}") String org, @Value("${influxdb.uri}") String url,
                                @Value("${influxdb.api_token}") String token) {
        this.org = org;
        this.url = url;
        this.token = token;
    }

    public List<DeviceDataTable> getRawDataForDevice(long deviceId, int lookbackHours, int lookbackHoursEnd) {

        if(lookbackHours <= lookbackHoursEnd)
            throw new IllegalArgumentException("lookbackHours must be greater than lookbackHoursEnd.");

        try (InfluxDBClient client = InfluxDBClientFactory.create(url, token.toCharArray())) {

            String query =
                    "option v = {timeRangeStart: -" + lookbackHours + "h, timeRangeStop: -" + lookbackHoursEnd + "h}\n" +
                    "from(bucket: \"raw_data_bucket\")\n" +
                    "    |> range(start: v.timeRangeStart, stop: v.timeRangeStop)\n" +
                    "    |> filter(fn: (r) => r[\"id\"] == \"" + deviceId + "\")\n" +
                    "    |> group(columns: [\"id\"])";

            List<FluxTable> tables = client.getQueryApi().query(query, org);

            return tables.stream().map(table -> {
                Optional<FluxRecord> recordWithDeviceId = table.getRecords().stream()
                        .filter(record -> record.getValueByKey("id") != null).findFirst();

                return recordWithDeviceId.map(fluxRecord -> new DeviceDataTable(
                        fluxRecord.getValueByKey("id"),
                        table.getRecords().stream()
                                .map(record -> new DeviceDataPoint(
                                                record.getTime() == null  ? -1 : record.getTime().toEpochMilli(),
                                                record.getField(),
                                                record.getValue()
                                        )
                                ).collect(Collectors.toList())
                )).orElseGet(() -> new DeviceDataTable("", List.of()));
            }).collect(Collectors.toList());
        } catch (Exception e){
            //Just printing stack trace and returning empty list.
            e.printStackTrace();
            return List.of();
        }
    }

}
