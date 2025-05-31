'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { Choice } from '@/types/choices'
import { cn } from '@/lib/utils'

type Value<T> = Choice<T>['value']

type BaseProps<T> = {
  choices: Choice<T>[]
  globalSelection?: Choice<T>['value'][]
  className?: string
  contentContainerStyle?: string
  hasAnimation?: boolean
}

type MultiSelectProps<T> = BaseProps<T> & {
  variant: 'multi'
  selected: Value<T>[]
  onSelectionChange: (newSelection: Value<T>[], value: Value<T>) => void
}

type SingleSelectProps<T> = BaseProps<T> & {
  variant: 'single'
  selected: Value<T> | null
  onSelectionChange: (newSelection: Value<T> | null) => void
}

type OptionSelectProps<T> = MultiSelectProps<T> | SingleSelectProps<T>

const isMultiSelect = <T,>(
  props: OptionSelectProps<T>
): props is MultiSelectProps<T> => {
  return props.variant === 'multi'
}

const transitionProps = {
  type: 'spring',
  stiffness: 500,
  damping: 30,
  mass: 0.5,
}

export const OptionSelect = React.memo(<T,>(props: OptionSelectProps<T>) => {
  const {
    variant,
    choices,
    globalSelection = [],
    className,
    contentContainerStyle,
    hasAnimation,
  } = props

  const handleSelect = (value: Value<T>) => {
    if (isMultiSelect(props)) {
      const { selected, onSelectionChange } = props

      const newSelected = selected.includes(value)
        ? selected.filter((val) => val !== value)
        : [...selected, value]

      onSelectionChange(newSelected, value)
    } else {
      const newSelected = value === props.selected ? null : value
      props.onSelectionChange(newSelected)
    }
  }

  const isValueSelected = (value: Value<T>) => {
    if (isMultiSelect(props)) {
      return props.selected.includes(value)
    } else {
      return value === props.selected
    }
  }

  return (
    <motion.div
      layout
      className={cn(
        'flex flex-wrap gap-3 overflow-visible',
        contentContainerStyle
      )}
      transition={transitionProps}
    >
      {choices.map((choice, index) => {
        const isSelected = isValueSelected(choice.value)

        const globallySelected = globalSelection.includes(choice.value)
        if (variant === 'multi' && globallySelected && !isSelected) return null

        return (
          <SelectButton
            key={index}
            choice={choice}
            isSelected={isSelected}
            hasAnimation={hasAnimation}
            onClick={() => {
              if (variant === 'single' && isSelected) return

              handleSelect(choice.value)
            }}
            className={className}
          />
        )
      })}
    </motion.div>
  )
})

OptionSelect.displayName = 'OptionSelect'

type SelectButtonProps<T> = {
  choice: Choice<T>
  isSelected: boolean
  onClick: () => void
  disabled?: boolean
  className?: string
  hasAnimation?: boolean
}

const SelectButton = <T,>({
  choice,
  isSelected,
  onClick,
  className,
  disabled = false,
  hasAnimation = true,
}: SelectButtonProps<T>) => {
  return (
    <motion.button
      type="button"
      layout
      initial={false}
      animate={{
        backgroundColor: isSelected ? '#1c3052' : 'rgba(39, 39, 42, 0.5)',
      }}
      whileHover={{
        backgroundColor: isSelected ? '#1c3052' : 'rgba(39, 39, 42, 0.8)',
      }}
      whileTap={{
        backgroundColor: isSelected ? '#8ba3ca' : 'rgba(39, 39, 42, 0.9)',
      }}
      transition={[transitionProps, { backgroundColor: { duration: 0.1 } }]}
      className={cn(
        'relative inline-flex items-center overflow-hidden whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-white ring-1 ring-inset ring-[hsla(0,0%,100%,0.06)] disabled:cursor-not-allowed dark:text-zinc-400',
        {
          'text-white ring-1 ring-blue-400': isSelected,
        },
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <motion.div
        className="relative flex w-full items-center justify-between text-white"
        animate={{
          width: isSelected && hasAnimation ? 'auto' : '100%',
          paddingRight: isSelected && hasAnimation ? '1.5rem' : '0',
        }}
        transition={{
          ease: [0.175, 0.885, 0.32, 1.275],
          duration: 0.3,
        }}
      >
        <span>{choice.label}</span>
      </motion.div>
      <AnimatePresence>
        {isSelected && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={transitionProps}
            className="absolute right-4"
          >
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-400/50">
              <Check className="h-3 w-3 text-white" strokeWidth={1.5} />
            </div>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
