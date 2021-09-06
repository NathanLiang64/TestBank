import FavoriteBlockButtonStyle from './favoriteBlockButton.style';

const FavoriteBlockButton = ({ icon, label, disabled }) => (
  <FavoriteBlockButtonStyle disabled={disabled}>
    <span>{icon}</span>
    <p>{label}</p>
  </FavoriteBlockButtonStyle>
);

export default FavoriteBlockButton;
