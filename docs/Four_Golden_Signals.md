# The Four golden signals

[The Google SRE book not only introduces the motivation to observe four main “signals” of a software system or a service for Side Reliability (SRE) discipline, they also build a baseline of comparable indicators which help you judge the healthiness and efficiency of the service you are offering:](https://landing.google.com/sre/sre-book/chapters/monitoring-distributed-systems/#xref_monitoring_golden-signals)

## Latency

The time it takes to service a request.

## Traffic

A measure of how much demand is being placed on your system, measured in a high-level system-specific metric.

## Errors

The rate of requests that fail, either explicitly, implicitly, or by policy.

## Saturation

How “full” your service is.

We strongly believe that each team should be at least be able to follow this observability pattern and build related tools around these signals.

.
