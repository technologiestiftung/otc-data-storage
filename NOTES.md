# Misc Notes

Create a migration after changes to the schema.prisma

```bash
npx prisma migrate save --name rename-location --experimental
```

run the migration

```bash
npx prisma migrate up --experimental
```
