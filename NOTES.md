# Misc Notes

Some notes to keep track of while working on the API

## Migrations

Create a migration after changes to the `./prisma/schema.prisma`

```bash
npx prisma migrate save --name rename-location --experimental
```

run the migration

```bash
npx prisma migrate up --experimental
```

## Mutations and Queries with Variables

You can test these in the GraphQL playground 👉 [http://localhost:4000/graphql](http://localhost:4000/graphql).

### Insert A New Camera

This is a mutation to add a camera

```graphql
# How to add a camera
mutation AddACamera($input: CameraCreateInput!) {
  insertCamera(data: $input) {
    id
    active
    name
    location
    timezone
  }
}
```

This is the JSON payload to pass as variables

```json
{
  "input": {
    "name": "Foo",
    "active": true,
    "location": "123 Fakestreet",
    "timezone": 123
  }
}
```

The Response should be

```json
{
  "data": {
    "insertCamera": {
      "id": 2,
      "active": true,
      "name": "Foo",
      "location": "123 Fakestreet",
      "timezone": 123
    }
  }
}
```

### Get A Camera with Counters and Detections

```graphql
query GetACamera($input: CameraWhereUniqueInput!) {
  cameraById(where: $input) {
    id
    name
    counters {
      id
      street
      detections {
        id
        detectedAt
        x
        y
        detectionType {
          id
          label
          description
        }
      }
    }
  }
}
```

The variables:

```json
{
  "input": {
    "id": 1
  }
}
```

## Add a Counter to a existing Camera

With new Detection and existing DetectionType

```graphql
mutation AddACounter($input: CounterCreateInput!) {
  insertCounter(data: $input) {
    id
  }
}
```

```json
{
  "input": {
    "active": true,
    "street": "123 Fakestreet",
    "streetId": "123",
    "line": "x",
    "direction": "x",
    "x1": 23.5,
    "y1": 42,
    "x2": 5.23,
    "y2": 5,
    "detections": {
      "create": {
        "detectedAt": "2020-06-06T12:17:01.123Z",
        "accuracy": 0,
        "x": 1,
        "y": 1,
        "detectionType": {
          "connect": {
            "id": 1
          }
        }
      }
    },
    "camera": {
      "connect": {
        "id": 1
      }
    }
  }
}
```

## Todos

Review these two guides for updating to the latest state of nexus and Prisma to make this project future proof

- [ ] [https://www.prisma.io/docs/guides/upgrade-from-prisma-1/upgrading-nexus-prisma-to-nexus](https://www.prisma.io/docs/guides/upgrade-from-prisma-1/upgrading-nexus-prisma-to-nexus)
