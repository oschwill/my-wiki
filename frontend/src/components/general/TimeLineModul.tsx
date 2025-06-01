import { TimeLineStep } from '../../dataTypes/baseTypes';

interface TimeLineModulProps {
  resetSteps: TimeLineStep[];
  resetStep: string;
}

const TimeLineModul: React.FC<TimeLineModulProps> = ({ resetSteps, resetStep }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-3 px-2">
      {resetSteps.map((step, index) => {
        const isActive = step.key === resetStep;
        const isCompleted = resetSteps.findIndex((s) => s.key === resetStep) > index;

        return (
          <div
            key={step.key}
            className={`text-center flex-fill ${index !== resetSteps.length - 1 ? 'me-2' : ''}`}
          >
            <div
              className={`rounded-circle mx-auto mb-1 ${
                isCompleted ? 'bg-success' : isActive ? 'bg-primary' : 'bg-secondary'
              }`}
              style={{
                width: '30px',
                height: '30px',
                lineHeight: '30px',
                color: 'white',
                fontSize: '14px',
              }}
            >
              {index + 1}
            </div>
            <small>{step.label}</small>
          </div>
        );
      })}
    </div>
  );
};

export default TimeLineModul;
