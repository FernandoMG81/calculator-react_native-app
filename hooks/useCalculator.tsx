import { useEffect, useRef, useState } from "react"

enum Operator {
  add = '+',
  substrack = '-',
  multiply = 'x',
  divide = '÷'
}

export const useCalculator = () => {

  const [formula, setFormula] = useState('0')
  const [number, setNumber] = useState('0')
  const [prevNumber, setPrevNumber] = useState('0')

  const lastOperation = useRef<Operator>()

  const clean = () => {
    setNumber('0')
    setFormula('0')
    setPrevNumber('0')
  }

  const toggleSign = () => {
    if (number.startsWith('-')) {
      setNumber(number.replace('-', ''))
    }
    else {
      setNumber('-' + number)
    }
  }

  const deleteLastNumber = () => {
    if ((number.includes('-') && number.length === 2) || number.length === 1) {
      return setNumber('0')
    }
    if (number.length > 1) {
      return setNumber(number.slice(0, -1))
    }

  }

  const setLastNumber = () => {
    calculateResult()

    if (number.endsWith('.')) {
      setPrevNumber(number.slice(0, -1))
    } else {
      setPrevNumber(number)
      setNumber('0')
    }
  }

  const divideOperation = () => {
    setLastNumber()
    lastOperation.current = Operator.divide
  }

  const multiplyOperation = () => {
    setLastNumber()
    lastOperation.current = Operator.multiply
  }
  const substrackOperation = () => {
    setLastNumber()
    lastOperation.current = Operator.substrack
  }
  const addOperation = () => {
    setLastNumber()
    lastOperation.current = Operator.add
  }

  const calculateSubResult = () => {
    const [firstValue, operation, secondValue] = formula.split(' ')

    const num1 = Number(firstValue)
    const num2 = Number(secondValue)

    if (isNaN(num2)) return num1

    switch (operation) {
      case Operator.add:
        return num1 + num2

      case Operator.add:
        return num1 - num2

      case Operator.add:
        return num1 * num2

      case Operator.add:
        return num1 / num2

      default:
        throw new Error(`Operation ${operation} not implemented`);
    }
  }

  const calculateResult = () => {
    const results = calculateSubResult()
    setFormula(`${results}`)

    lastOperation.current = undefined
    setPrevNumber('0')
  }

  const buildNumber = (numberString: string) => {

    if (number.includes('.') && numberString === '.') return

    if (number.startsWith('0') || number.startsWith('-0')) {
      if (numberString === '.') {
        return setNumber(number + numberString)
      }

      if (numberString === '0' && number.includes('.')) {
        return setNumber(number + numberString)
      }

      if (numberString !== '0' && !number.includes('.')) {
        return setNumber(numberString)
      }

      if (numberString === '0' && !number.includes('.')) return

    }

    setNumber(number + numberString)
  }

  useEffect(() => {
    if (lastOperation.current) {
      const firstFormulaPart = formula.split(' ').at(0)
      setFormula(`${firstFormulaPart} ${lastOperation.current} ${number}`)
    } else {
      setFormula(number)
    }
  }, [number])

  useEffect(() => {
    const subResult = calculateSubResult()
    setPrevNumber(`${subResult}`)
  }, [number])

  return {
    formula,
    number,
    prevNumber,

    // Methods
    buildNumber,
    clean,
    toggleSign,
    deleteLastNumber,

    divideOperation,
    multiplyOperation,
    substrackOperation,
    addOperation,
    calculateSubResult,
    calculateResult
  }

}