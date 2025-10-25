interface ComponentNameProps {
  propName: string
}

export default function ComponentName({ propName }: ComponentNameProps) {
  return <div>Je suis un test {propName} </div>
}
