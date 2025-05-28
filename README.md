npm install

# Install React Navigation dependencies
npx expo install @react-navigation/native @react-navigation/stack

# Install React Native Paper for UI components
npm install react-native-paper

# Install image picker
npx expo install expo-image-picker

# Install axios for API calls
npm install axios

npx expo start



# backend part
cd backend

python -m venv venv

# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt

python main.py