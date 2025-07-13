import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react'
import { Tabs, Tab } from '@heroui/react'
import { Card, CardBody } from '@heroui/react'
import { Checkbox, CheckboxGroup } from '@heroui/react'
import { useApiStore } from '@/store/apiStore'
import { useCheckbox, tv, Chip, VisuallyHidden } from '@heroui/react'
import { useMemo } from 'react'

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1rem"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

const AllSelectedCheckbox = ({
  onValueChange,
}: {
  onValueChange?: (isSelected: boolean) => void
}) => {
  const { children, isSelected, isFocusVisible, getBaseProps, getLabelProps, getInputProps } =
    useCheckbox({
      name: 'all',
      value: 'all',
      onChange: e => {
        onValueChange?.(e.target.checked)
      },
    })

  const checkbox = tv({
    slots: {
      base: 'border-default hover:bg-default-300',
      content: 'text-sm font-medium',
    },
    variants: {
      isSelected: {
        true: {
          base: 'border-gray-400 bg-gray-800 hover:bg-gray-600 hover:border-gray-400',
          content: 'text-white pl-1',
        },
      },
      isFocusVisible: {
        true: {
          base: 'outline-none ring-2 ring-default ring-offset-2 ring-offset-background',
        },
      },
    },
  })

  const styles = checkbox({ isSelected, isFocusVisible })

  return (
    <label {...getBaseProps()} className="min-w-[6.5rem]">
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <Chip
        classNames={{
          base: styles.base(),
          content: styles.content(),
        }}
        color="default"
        startContent={isSelected ? <CheckIcon className="ml-1 text-white" /> : null}
        variant="faded"
        {...getLabelProps()}
      >
        {children ? children : isSelected ? '全选' : '全不选'}
      </Chip>
    </label>
  )
}

export default function SettingsModal({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}) {
  const CardClassNames = {
    base: 'overflow-y-auto h-[17rem] w-full bg-transparent dark:bg-transparent border-medium border-default-200 shadow-xs rounded-medium',
  }
  // 视频源设置
  const { selectedAPIs, setSelectedAPIs, selectAllAPIs, deselectAllAPIs, getAllAPIs } =
    useApiStore()
  const apiInfos = getAllAPIs()
  const checkGroupValue = useMemo(() => {
    if (selectedAPIs.length === apiInfos.length) {
      return [...selectedAPIs, 'all']
    }
    return [...selectedAPIs]
  }, [selectedAPIs])
  return (
    <Modal
      classNames={{
        base: 'bg-transparent',
        backdrop: 'bg-white/10',
      }}
      hideCloseButton
      backdrop="blur"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <ModalHeader>个性化设置</ModalHeader>
        <ModalBody>
          <div className="flex flex-col">
            <Tabs variant="bordered" isVertical disabledKeys={['other']}>
              <Tab className="w-full" key="video-source" title="视频源选择">
                <Card classNames={CardClassNames}>
                  <CardBody>
                    <CheckboxGroup
                      classNames={{
                        wrapper: 'flex gap-5',
                      }}
                      orientation="horizontal"
                      value={checkGroupValue}
                      onValueChange={value => {
                        setSelectedAPIs(value.filter(item => item !== 'all'))
                      }}
                    >
                      <AllSelectedCheckbox
                        onValueChange={isAllSelected => {
                          if (isAllSelected) {
                            selectAllAPIs(true)
                          } else {
                            deselectAllAPIs()
                          }
                        }}
                      />
                      {apiInfos.map(({ key, name }) => (
                        <Checkbox
                          color="default"
                          classNames={{
                            base: 'min-w-[7.5rem]',
                            label: 'text-sm font-medium',
                          }}
                          name={key}
                          key={key}
                          value={key}
                        >
                          {name}
                        </Checkbox>
                      ))}
                    </CheckboxGroup>
                  </CardBody>
                </Card>
              </Tab>
              <Tab className="w-full" key="custom-source" title="自定义源">
                <Card classNames={CardClassNames}>
                  <CardBody>自定义源</CardBody>
                </Card>
              </Tab>
              <Tab className="w-full" key="other" title="敬请期待...">
                <Card classNames={CardClassNames}>
                  <CardBody>敬请期待...</CardBody>
                </Card>
              </Tab>
            </Tabs>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            className="bg-gradient-to-br from-gray-500 to-gray-950 font-bold text-white shadow-lg"
            radius="full"
            onPress={() => onOpenChange(false)}
          >
            应用
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
