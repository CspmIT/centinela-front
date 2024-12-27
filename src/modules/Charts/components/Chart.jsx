
const Chart = ({ width, children }) => {
    return (
        <section className={`flex flex-col ${width} h-80`}>
            {children}
        </section>
    )
}

export default Chart