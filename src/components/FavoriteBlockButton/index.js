import { BlockSelectedIcon } from 'assets/images/icons';
import FavoriteBlockButtonStyle from './favoriteBlockButton.style';

const FavoriteBlockButton = ({
  icon, label, className, disabled, onClick, data,
}) => (
  <FavoriteBlockButtonStyle
    data-block={data}
    className={`favoriteBlockButton ${className}`}
    disabled={disabled}
    onClick={onClick}
  >
    <span>{icon}</span>
    <p>{label}</p>
    <BlockSelectedIcon className="selectedIcon" />
  </FavoriteBlockButtonStyle>
);

export default FavoriteBlockButton;
