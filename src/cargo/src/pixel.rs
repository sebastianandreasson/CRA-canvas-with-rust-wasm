use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[repr(C)]
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Pixel {
  pub r: u8,
  pub g: u8,
  pub b: u8,
  pub a: u8,
}

impl Pixel {
  pub fn new(r: u8, g: u8, b: u8, a: u8) -> Pixel {
    Pixel { r, g, b, a }
  }
}

pub static WHITE_PIXEL: Pixel = Pixel {
  r: 255,
  g: 255,
  b: 255,
  a: 255,
};
