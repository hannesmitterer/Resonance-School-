# Grafana Dashboard Configuration for Resonance School Data Integration

This directory contains monitoring configurations for the Data Integration System.

## Setup Grafana with Prometheus

### 1. Install Grafana

**Using Docker:**
```bash
docker run -d -p 3001:3000 --name=grafana grafana/grafana
```

**Using package manager (Ubuntu/Debian):**
```bash
sudo apt-get install -y software-properties-common
sudo add-apt-repository "deb https://packages.grafana.com/oss/deb stable main"
wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -
sudo apt-get update
sudo apt-get install grafana
sudo systemctl start grafana-server
```

### 2. Install Prometheus

**Using Docker:**
```bash
docker run -d -p 9090:9090 \
  -v $(pwd)/monitoring/prometheus.yml:/etc/prometheus/prometheus.yml \
  prom/prometheus
```

**Using package manager:**
```bash
wget https://github.com/prometheus/prometheus/releases/download/v2.45.0/prometheus-2.45.0.linux-amd64.tar.gz
tar xvfz prometheus-*.tar.gz
cd prometheus-*
./prometheus --config.file=../monitoring/prometheus.yml
```

### 3. Configure Grafana

1. Access Grafana at `http://localhost:3001` (default login: admin/admin)

2. Add Prometheus as a data source:
   - Go to Configuration → Data Sources
   - Click "Add data source"
   - Select "Prometheus"
   - Set URL to `http://localhost:9090`
   - Click "Save & Test"

### 4. Import Dashboard

Create a new dashboard with the following panels:

#### Panel 1: API Health Status
- **Type:** Stat
- **Query:** `api_health_status`
- **Visualization:** Show values as percentage

#### Panel 2: API Request Rate
- **Type:** Graph
- **Query:** `rate(api_requests_total[5m])`
- **Legend:** `{{api_id}} - {{status}}`

#### Panel 3: API Latency
- **Type:** Heatmap
- **Query:** `rate(api_latency_seconds_bucket[5m])`

#### Panel 4: IPFS Operations
- **Type:** Graph
- **Queries:**
  - `rate(ipfs_stores_total{status="success"}[5m])`
  - `rate(ipfs_stores_total{status="failure"}[5m])`

#### Panel 5: Queue Size
- **Type:** Gauge
- **Query:** `queue_size`
- **Thresholds:** 
  - Green: 0-5000
  - Yellow: 5000-8000
  - Red: 8000-10000

#### Panel 6: WebSocket Connections
- **Type:** Stat
- **Query:** `websocket_connections{status="connected"}`

#### Panel 7: Recovery Attempts
- **Type:** Graph
- **Query:** `rate(recovery_attempts_total[5m])`
- **Legend:** `{{component}} - {{status}}`

#### Panel 8: Validation Success Rate
- **Type:** Stat
- **Query:** `rate(validation_checks_total{result="valid"}[5m]) / rate(validation_checks_total[5m]) * 100`
- **Unit:** Percent (0-100)

## Key Metrics to Monitor

### System Health
- `api_health_status` - API availability
- `queue_size` - Data queue utilization
- `websocket_connections` - Active connections

### Performance
- `api_latency_seconds` - Response times
- `rate(api_requests_total[5m])` - Request throughput

### Data Integrity
- `validation_checks_total{result="valid"}` - Validation success
- `ipfs_stores_total{status="success"}` - Successful IPFS writes
- `ipfs_cid_versions` - Version tracking

### Recovery & Reliability
- `recovery_attempts_total` - Self-healing activity
- `health_checks_total` - System monitoring

## Alert Rules

Create alert rules in Prometheus for critical conditions:

```yaml
# alerts.yml
groups:
  - name: resonance_alerts
    interval: 30s
    rules:
      - alert: APIDown
        expr: api_health_status == 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "API {{ $labels.api_id }} is down"
          
      - alert: HighQueueUtilization
        expr: (queue_size / 10000) > 0.8
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Queue utilization above 80%"
          
      - alert: IPFSStorageFailures
        expr: rate(ipfs_stores_total{status="failure"}[5m]) > 0.1
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "High IPFS storage failure rate"
          
      - alert: ValidationFailureRate
        expr: rate(validation_checks_total{result="invalid"}[5m]) / rate(validation_checks_total[5m]) > 0.2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Validation failure rate above 20%"
```

## Using the Monitoring Stack

1. **Start the Data Integration System:**
   ```bash
   npm start
   ```

2. **Verify metrics are being collected:**
   ```bash
   curl http://localhost:3000/metrics
   ```

3. **Access monitoring tools:**
   - Prometheus: `http://localhost:9090`
   - Grafana: `http://localhost:3001`
   - Built-in Dashboard: `http://localhost:3000/dashboard`

## Troubleshooting

### Metrics not appearing in Prometheus

1. Check Prometheus targets: `http://localhost:9090/targets`
2. Verify the scrape configuration in `prometheus.yml`
3. Ensure the Data Integration System is running

### Grafana shows no data

1. Verify Prometheus data source is configured correctly
2. Check that Prometheus is scraping successfully
3. Adjust time range in Grafana dashboard

### High resource usage

1. Increase scrape interval in `prometheus.yml`
2. Reduce retention period
3. Optimize dashboard queries

## Best Practices

1. **Regular Monitoring:** Check dashboards daily for anomalies
2. **Alert Configuration:** Set up alerts for critical metrics
3. **Retention Policy:** Configure appropriate data retention
4. **Dashboard Organization:** Group related metrics together
5. **Documentation:** Keep notes on normal baseline values

---

For more information, see the [Data Integration Guide](../DATA_INTEGRATION_GUIDE.md).
