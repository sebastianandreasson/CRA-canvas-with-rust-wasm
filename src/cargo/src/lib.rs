extern crate cfg_if;
extern crate wasm_bindgen;

mod pixel;
mod utils;

use crate::pixel::Pixel;
use crate::pixel::WHITE_PIXEL;
use wasm_bindgen::prelude::*;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub struct Canvas {
    width: i32,
    height: i32,
    pixels: Vec<Pixel>,
}

#[wasm_bindgen]
impl Canvas {
    pub fn width(&self) -> i32 {
        self.width
    }
    pub fn height(&self) -> i32 {
        self.height
    }

    pub fn pixels(&self) -> *const Pixel {
        self.pixels.as_ptr()
    }

    pub fn paint(&mut self, x: i32, y: i32, size: i32, r: u8, g: u8, b: u8, a: u8) {
        if size == 1 {
            let i = self.get_index(x, y);
            self.pixels[i] = Pixel::new(r, g, b, a);
            return;
        }

        let radius = size / 2;
        for dx in -radius..radius + 1 {
            for dy in -radius..radius + 1 {
                if dx * dx + dy * dy > (radius * radius) - 1 {
                    continue;
                };
                let px = x + dx;
                let py = y + dy;
                let i = self.get_index(px, py);
                if px < 0 || px > self.width - 1 || py < 0 || py > self.height - 1 {
                    continue;
                }
                self.pixels[i] = Pixel::new(r, g, b, a);
            }
        }
    }

    pub fn new(width: i32, height: i32) -> Canvas {
        let mut pixels: Vec<Pixel> = Vec::new();
        for _ in 0..height {
            for _ in 0..width {
                pixels.push(WHITE_PIXEL);
            }
        }

        Canvas {
            width,
            height,
            pixels,
        }
    }
}

impl Canvas {
    fn get_index(&self, x: i32, y: i32) -> usize {
        (x + (y * self.width)) as usize
    }
}

#[wasm_bindgen]
pub fn wasm_memory() -> JsValue {
    wasm_bindgen::memory()
}
