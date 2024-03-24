npx prisma db push
pnpm run db:seed
rm -rf ./dist
tsc
mkdir ./dist/src/views
cp -r ./src/views/* ./dist/src/views