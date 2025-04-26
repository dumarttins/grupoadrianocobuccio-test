#!/bin/bash

# Create main src directory
mkdir -p src

# Create components directory and subdirectories
mkdir -p src/components/common
touch src/components/common/Button.jsx
touch src/components/common/Card.jsx
touch src/components/common/Input.jsx
touch src/components/common/Alert.jsx
touch src/components/common/Modal.jsx
touch src/components/common/Spinner.jsx

mkdir -p src/components/auth
touch src/components/auth/LoginForm.jsx
touch src/components/auth/RegisterForm.jsx

mkdir -p src/components/layout
touch src/components/layout/Header.jsx
touch src/components/layout/Sidebar.jsx
touch src/components/layout/Footer.jsx
touch src/components/layout/MainLayout.jsx

mkdir -p src/components/wallet
touch src/components/wallet/BalanceCard.jsx
touch src/components/wallet/TransactionList.jsx
touch src/components/wallet/TransactionItem.jsx
touch src/components/wallet/DepositForm.jsx
touch src/components/wallet/TransferForm.jsx
touch src/components/wallet/ReverseTransactionModal.jsx

# Create contexts directory
mkdir -p src/contexts
touch src/contexts/AuthContext.jsx
touch src/contexts/WalletContext.jsx

# Create hooks directory
mkdir -p src/hooks
touch src/hooks/useAuth.js
touch src/hooks/useWallet.js
touch src/hooks/useAxios.js

# Create pages directory and subdirectories
mkdir -p src/pages/auth
touch src/pages/auth/LoginPage.jsx
touch src/pages/auth/RegisterPage.jsx

mkdir -p src/pages/dashboard
touch src/pages/dashboard/DashboardPage.jsx

mkdir -p src/pages/wallet
touch src/pages/wallet/WalletPage.jsx
touch src/pages/wallet/DepositPage.jsx
touch src/pages/wallet/TransferPage.jsx

mkdir -p src/pages/errors
touch src/pages/errors/NotFoundPage.jsx
touch src/pages/errors/UnauthorizedPage.jsx

# Create services directory
mkdir -p src/services
touch src/services/api.js
touch src/services/authService.js
touch src/services/walletService.js

# Create utils directory
mkdir -p src/utils
touch src/utils/formatters.js
touch src/utils/validators.js
touch src/utils/constants.js

# Create assets directory
mkdir -p src/assets/images
mkdir -p src/assets/styles

# Create root files
touch src/App.jsx
touch src/index.jsx
touch src/Routes.jsx

echo "Project structure created successfully!"