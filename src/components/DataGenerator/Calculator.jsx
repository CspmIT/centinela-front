import { useEffect, useRef } from 'react'
import { Button, Chip, Paper, Typography } from '@mui/material'
import { useVars } from './ProviderVars'

const Calculadora = ({ display, setDisplay, showNumbers }) => {
    const [state, dispatch] = useVars()
    const calculatorRef = useRef(null)
    const inputRef = useRef(null)

    const handleDeleteVar = (variable) => {
        dispatch({ type: 'REMOVE_CALC_VAR', payload: variable })
        setDisplay((prev) => prev.replaceAll(`{{${variable}}}`, ''))
    }

    const handleClear = () => {
        setDisplay('')
    }

    const handleClick = (value) => {
        setDisplay((prev) => prev + value)
    }

    const handleKeyDown = (e) => {
        const validKeys = '0123456789/*-+()'.split('')
        if (validKeys.includes(e.key) && showNumbers) {
            const activeElement = document.activeElement
            if (
                calculatorRef.current.contains(activeElement) ||
                activeElement === document.body
            ) {
                handleClick(e.key)
            }
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    const buttons = [
        ...(showNumbers
            ? [
                  { value: '1', icon: '1' },
                  { value: '2', icon: '2' },
                  { value: '3', icon: '3' },
                  { value: '4', icon: '4' },
                  { value: '5', icon: '5' },
                  { value: '6', icon: '6' },
                  { value: '7', icon: '7' },
                  { value: '8', icon: '8' },
                  { value: '9', icon: '9' },
                  { value: '0', icon: '0' },
              ]
            : []),
        { value: '/', icon: '/' },
        { value: '*', icon: '*' },
        { value: '-', icon: '-' },
        { value: '+', icon: '+' },
        { value: '==', icon: '==' },
        { value: '!=', icon: '!=' },
        { value: '(', icon: '(' },
        { value: ')', icon: ')' },
        { value: '<', icon: '<' },
        { value: '>', icon: '>' },
        { value: '<=', icon: '<=' },
        { value: '>=', icon: '>=' },
        { value: '&&', icon: 'AND' },
        { value: '||', icon: 'OR' },
        { value: '!', icon: 'NOT' },
        { value: 'C', icon: 'C' },
    ]

    const handleFocus = () => {
        inputRef.current.focus()
    }

    return (
        <Paper
            elevation={0}
            style={{ padding: '.5rem', margin: 'auto' }}
            ref={calculatorRef}
            onClick={handleFocus}
        >
            <Typography variant="h6" className="!mb-2" align="center">
                Formula de la variable
            </Typography>

            <div className="flex justify-center w-full gap-3 max-md:flex-wrap">
                <div className="w-full flex justify-end">
                    <div className="flex xl:w-1/2 2xl:w-1/3 w-full gap-1 mb-1 flex-wrap justify-center">
                        {buttons.map(({ value, icon }) => (
                            <Button
                                key={value}
                                variant="contained"
                                onClick={() => {
                                    if (value === 'C') handleClear()
                                    else handleClick(value)
                                }}
                            >
                                {icon}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="w-full flex flex-col gap-3">
                    {state.calcVars.length >= 1 && (
                        <div className="flex gap-1 w-full flex-wrap">
                            {state.calcVars.map((variable) => (
                                <Chip
                                    key={variable.calc_name_var}
                                    color="success"
                                    draggable
                                    onDragStart={(e) =>
                                        e.dataTransfer.setData(
                                            'text',
                                            variable.calc_name_var
                                        )
                                    }
                                    onClick={() =>
                                        handleClick(
                                            `{{${variable.calc_name_var}}}`
                                        )
                                    }
                                    label={variable.calc_name_var}
                                    onDelete={() =>
                                        handleDeleteVar(variable.calc_name_var)
                                    }
                                />
                            ))}
                        </div>
                    )}
                    <div className="w-2/3 max-lg:w-full flex h-full p-2 relative border-dashed border-[1px] border-gray-400">
                        <input
                            ref={inputRef}
                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-text"
                        />
                        {display.split(' ').map((item, index) => (
                            <span
                                key={index}
                                style={{
                                    color:
                                        item.startsWith('{{') &&
                                        item.endsWith('}}')
                                            ? 'blue'
                                            : 'black',
                                }}
                            >
                                {item}{' '}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </Paper>
    )
}

export default Calculadora
