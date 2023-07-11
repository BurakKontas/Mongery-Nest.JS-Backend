-- CreateIndex
CREATE INDEX "Categories_userId_idx" ON "Categories"("userId");

-- CreateIndex
CREATE INDEX "CustomInputs_productId_idx" ON "CustomInputs"("productId");

-- CreateIndex
CREATE INDEX "Customers_userId_idx" ON "Customers"("userId");

-- CreateIndex
CREATE INDEX "Products_userId_idx" ON "Products"("userId");

-- CreateIndex
CREATE INDEX "States_userId_idx" ON "States"("userId");

-- CreateIndex
CREATE INDEX "Users_email_idx" ON "Users"("email");
