#!/bin/bash

# Run tests with coverage
pnpm test:coverage

# Check if coverage meets minimum threshold
if [ $? -eq 0 ]; then
  echo "✅ Tests passed with minimum 80% coverage"
  exit 0
else
  echo "❌ Tests failed or coverage below 80%"
  exit 1
fi 