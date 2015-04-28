<!-- Communication Protocol {{{ -->
# Communication Protocol
## Track a people
* channel: **tracker**
* type: **publish**
* data:

```javascript
{
  "type": "TRACK",
  "filter": "expression"
}
```

## Untrack a people
* channel: **tracker**
* type: **publish**
* data:

```javascript
{
  "type": "UNTRACK",
  "filter": "expression"
}
```
<!-- }}} Communication Protocol -->

<!-- Update Location {{{ -->
## Update location
* channel: **track**
* type: **publish**
* data:

```javascript
{
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
  "code": "OK",
  "name": "Area/Zona/Gedung",
  "lat": 123,
  "lng": 456,
  "time": 1234567890
}
```

## Notif to stop publish
* channel: **userId**
* type: **subscribe**
* data:

```javascript
{
  "code": "STOP"
}
```

## Notif to check
* channel: **userId**
* type: **subscribe**
* data:

```javascript
{
  "code": "CHECK"
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
