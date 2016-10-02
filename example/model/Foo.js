/**
  This is class Foo.
*/
class Foo {

  /**
    @param {String} bar
    @param {String} baz
    @example
    const foo = new Foo('foo', 'bar')
  */
  constructor(bar, baz) {
    /**
      This is instance variable 'a'
    */
    this.a = "a"
  }

  /**
    This is property 'bar'
  */
  get bar() {}

  /**
    This is method 'baz'
  */
  baz() {}
}

/**
  This is static variable 'bla'
*/
Foo.bla = "bla"

/**
  This is static method 'blupp'
*/
Foo.blupp = function() {}

export default Foo
