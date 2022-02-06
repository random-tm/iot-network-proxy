# iot-network-proxy
A simple network solution to send events to the state server. Support retry only when explicitly specified and does not support multiple instances. Intended for use cases with failover setup.

Use this or the iot-network-relay project depending on your needs. This is faster,  more secure, and has better retry logic. It however lacks redunancy meaning it falls short with multiple locations.