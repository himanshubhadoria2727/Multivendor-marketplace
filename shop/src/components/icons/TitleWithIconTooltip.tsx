import { Tooltip, IconButton } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import DomainIcon from '@mui/icons-material/Domain';
import BarChartIcon from '@mui/icons-material/BarChart';
import LinkIcon from '@mui/icons-material/Link';
import TrafficIcon from '@mui/icons-material/Traffic';

const TitleWithIconTooltip = ({ title, tooltipText, icon }) => (
  <div className="flex items-center">
    <span>{title}</span>
    <Tooltip title={tooltipText}>
      <IconButton size="small" style={{ marginLeft: 8 }}>
        {icon}
      </IconButton>
    </Tooltip>
  </div>
);

export default TitleWithIconTooltip;
