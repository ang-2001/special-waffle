import OnboardingForm from '../components/organisms/OnboardingForm/OnboardingForm';
import AuthPageTemplate from '../components/templates/AuthPageTemplate';

const OnboardingPage = () => {
  return (
    <AuthPageTemplate heading="Welcome to Waffler">
      <OnboardingForm />
    </AuthPageTemplate>
  )
}

export default OnboardingPage
