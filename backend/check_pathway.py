import pathway as pw

print("Pathway version:", pw.__version__)
print("Has Schema:", hasattr(pw, 'Schema'))
print("Has io:", hasattr(pw, 'io'))
print("Has python connector:", hasattr(pw.io, 'python') if hasattr(pw, 'io') else False)
