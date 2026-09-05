import ProfileForm from '../components/organisms/ProfileForm/ProfileForm';
import AuthPageTemplate from '../components/templates/AuthPageTemplate';

const ProfilePage = () => {
  return (
    <AuthPageTemplate heading="Profile">
      <ProfileForm />
    </AuthPageTemplate>
  )
}

export default ProfilePage
