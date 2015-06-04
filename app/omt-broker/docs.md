<!-- Type of Broker {{{ -->
# Type of Broker

## Simple Broker
  * Publish/Subscribe with loosely couple
  * There is no idle criteria

## Adaptive Broker
  * If idle limit reached, stop publish location
  * Broker can query client to send location
<!-- }}} Type of Broker -->

<!-- Communication Protocol {{{ -->
# Communication Protocol
## Track a people
* channel: **track**
* type: **publish**
* data:

```javascript
{
  "filter": "expression"
}
```

## Untrack a people
* channel: **untrack**
* type: **publish**
* data:

```javascript
{
  "filter": "expression"
}
```
<!-- }}} Communication Protocol -->

<!-- Update Location {{{ -->
## Update location
* channel: **location**
* type: **publish**
* data:

```javascript
{
  "code": "T/C",
  "user": "userId",
  "lat": x,
  "lng": y,
  "time": timestamp
}
```
<!-- }}} Update Location -->

<!-- Notification {{{ -->
## Notif a location
* channel: **userId**
* type: **subscribe**
* data:

```javascript
{
  "code": "L",
  "level": "<level_id>",
  "name": "<name of nearest level>",
  "lat": <lat>,
  "lng": <lng>,
  "time": <timestamp>
}
```

## Notif for stop publish
* channel: **userId**
* type: **subscribe**
* data:

```javascript
{
  "code": "S"
}
```

## Notif for check protocol
* channel: **userId**
* type: **subscribe**
* data:

```javascript
{
  "code": "C"
}
```

## Notif for track expression
* channel: **userId**
* type: **subscribe**
* data:

```javascript
{
  "code": "T",
  "filter": "expression"
}
```

## Notif for untrack expression
* channel: **userId**
* type: **subscribe**
* data:

```javascript
{
  "code": "U",
  "filter": "expression"
}
```
<!-- }}} Notification -->

<!-- Data Format {{{ -->
# Data Format

## Configuration

```javascript
{
  "broker": {
    "id": "ohmytrack",
    "stats": false,
    "port": 1883,
    "httpPort": 8000,
    "scheduler": 5000,
    "publishNewClient": false,
    "subscribedNewClient": false,
    "backend": {
      "type": "mongo",
      "url": "mongodb://localhost:27017/ohmytrack",
      "pubsubCollection": "pubsub",
      "mongo": {}
    }
  },
  "database": {
    "host": "localhost",
    "user": "icub",
    "password": "database",
    "database": "ohmytrack",
    "debug": false
  }
}
```

## User Data Structure

```javascript
var users = {
  icub: {
    users: [
      "webtrack_icub",
      "droidtrack_icub"
    ],
    subscriptions: [
      "filter 1",
      "filter 2",
      "filter 3",
    ],
    idle: 5
  }
}
```

## Data Location

* Geometry Format

```
  POLYGON((x1 y1, x2 y2, x1 y1))
```

* Geojson Format

```javascript
{
  "type": "Feature",
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [x1, y1],
      [x2, y2],
      [x1, y1]
    ]
  },
  "properties": {
    "code": "FTIF"
    "name": "FTIF"
  }
}
```
<!-- }}} Data Format -->
