import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';
import { faBars, faGrip } from '@fortawesome/free-solid-svg-icons';

type ViewMode = 'grid' | 'list';

interface ListHeaderToolbarProps {
  title: string;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const ListHeaderToolbar: React.FC<ListHeaderToolbarProps> = ({
  title,
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-2">
      <h5 className="mb-0">{title}</h5>

      <div>
        <Button
          variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
          size="sm"
          className="me-1"
          onClick={() => onViewModeChange('grid')}
          title="Grid Ansicht"
        >
          <FontAwesomeIcon icon={faGrip} />
        </Button>

        <Button
          variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
          size="sm"
          onClick={() => onViewModeChange('list')}
          title="Listen Ansicht"
        >
          <FontAwesomeIcon icon={faBars} />
        </Button>
      </div>
    </div>
  );
};

export default ListHeaderToolbar;
