import { BlockSelectedIcon } from 'assets/images/icons';
import FavoriteBlockButtonStyle from './favoriteBlockButton.style';

const FavoriteBlockButton = ({
  icon, label, className, disabled, onClick, data, noCheckbox, noBorder,
}) => (
  <FavoriteBlockButtonStyle
    data-block={data}
    className={`favoriteBlockButton ${className || ''}`}
    disabled={disabled}
    onClick={onClick}
    $noBorder={noBorder}
  >
    {icon}
    <p>{label}</p>
    { !noCheckbox && <BlockSelectedIcon className="selectedIcon" /> }
  </FavoriteBlockButtonStyle>
);

export default FavoriteBlockButton;
