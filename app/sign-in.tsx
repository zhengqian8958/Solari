import { router } from 'expo-router'
import { useAuth } from '@/components/auth/auth-provider'
import { AppView } from '@/components/app-view'
import { AppConfig } from '@/constants/app-config'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native'
import { LoginMascot } from '@/components/auth/LoginMascot'
import { PORTFOLIO_COLORS } from '@/constants/portfolioTheme'
import { LinearGradient } from 'expo-linear-gradient'

const { width } = Dimensions.get('window')

export default function SignIn() {
  const { signIn } = useAuth()

  return (
    <LinearGradient
      colors={['#fccdd6', '#f9c4d2', '#e9c9f5', '#dbc4f0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Top Section - Branding */}
        <View style={styles.headerSection}>
          <Text style={styles.appName}>{AppConfig.name}</Text>
          <Text style={styles.slogan}>{AppConfig.slogan}</Text>

          {/* Decorative sparkles */}
          <View style={[styles.sparkle, styles.sparkle1]}>
            <Text style={styles.sparkleText}>✨</Text>
          </View>
          <View style={[styles.sparkle, styles.sparkle2]}>
            <Text style={styles.sparkleText}>⭐</Text>
          </View>
        </View>

        {/* Middle Section - Mascot */}
        <View style={styles.mascotSection}>
          <LoginMascot />
        </View>

        {/* Bottom Section - Connect Button */}
        <View style={styles.actionSection}>
          <Pressable
            style={({ pressed }) => [
              styles.connectButton,
              pressed && styles.connectButtonPressed,
            ]}
            onPress={async () => {
              await signIn()
              router.replace('/')
            }}
          >
            <Text style={styles.connectButtonText}>CONNECT WALLET</Text>
          </Pressable>

          {/* Terms text */}
          <Text style={styles.termsText}>
            By connecting, you agree to the{' '}
            <Text style={styles.termsLink}>terms</Text>
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: 40,
    position: 'relative',
  },
  appName: {
    fontSize: 48,
    fontWeight: '900',
    color: '#000',
    letterSpacing: -2,
    textShadowColor: PORTFOLIO_COLORS['anime-blue'],
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
  },
  slogan: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d3748',
    marginTop: 8,
    textAlign: 'center',
  },
  sparkle: {
    position: 'absolute',
  },
  sparkle1: {
    top: 20,
    right: 20,
  },
  sparkle2: {
    top: 80,
    right: 60,
  },
  sparkleText: {
    fontSize: 24,
  },
  mascotSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionSection: {
    paddingBottom: 40,
    gap: 16,
    alignItems: 'center',
  },
  connectButton: {
    width: width - 40,
    backgroundColor: PORTFOLIO_COLORS['anime-mint'],
    paddingVertical: 18,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
    alignItems: 'center',
  },
  connectButtonPressed: {
    shadowOffset: { width: 3, height: 3 },
    transform: [{ translateY: 3 }, { translateX: 3 }],
  },
  connectButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 1,
  },
  termsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b46c1',
    textAlign: 'center',
  },
  termsLink: {
    textDecorationLine: 'underline',
    fontWeight: '800',
  },
})
