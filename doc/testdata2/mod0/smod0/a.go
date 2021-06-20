package smod0_custom
import (
	"foo"
	"bar/baz"
	kluts "foo.com/bar/baz"
)
//docstring 0
//docstring 1
type struct0 struct {
	m0 string
}
//docstring 0
//docstring 1
type struct1 struct {
	m0 string
	m1 byte
}

//docstring 0
//docstring 1
func (ident0 *struct0) Fn0() (ident string) {
}
//docstring 0
//docstring 1
func (ident0 *struct0) Fn1() (ident string) {
}
//docstring 0
//docstring 1
func (ident0 *struct1) Fn2() (ident string) {
}

func init() {
}
