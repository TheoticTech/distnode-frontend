// Third party
import { InView } from 'react-intersection-observer'

// Calls onVisible when wrapped component is visible
function VisibilityTriggerWrapper({ onVisible, child }: any) {
  return (
    <InView
      triggerOnce={true}
      onChange={(inView: boolean) => {
        if (inView) {
          onVisible()
        }
      }}
    >
      {child}
    </InView>
  )
}

export default VisibilityTriggerWrapper
