import page from '../../vendor/scripts/page';
import {
  switchStateTab,
  selectDefaultMode,
  selectCandidateMode,
  selectManualMode,
} from './controller';


page('/',
  switchStateTab,
  selectDefaultMode);

page('/candidate',
  switchStateTab,
  selectCandidateMode);

page('/manual',
  switchStateTab,
  selectManualMode);

page('/:state',
  switchStateTab,
  selectDefaultMode
  );

page('/:state/candidate',
  switchStateTab,
  selectCandidateMode);

page('/:state/manual',
  switchStateTab,
  selectManualMode);

page();
