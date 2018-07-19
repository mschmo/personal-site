title: If you can't formulate, simulate
date_clean: March 10th 2018
published: 2018-03-10 00:00:00
images: True
tags: [biology, rust]
styles: []
scripts: []

For the last week or so I've been working through bioinformatics problems on Rosalind[http://rosalind.info/], an educational site that provides hundreds of programming challenges. Regardless of whether your background is in biology or computer science...

2. Introduce the problem in question. Mendel and all that.

3. Explain why you suck at statistics and probability, even though you work with data for a living.

There's one problem here. I suck at any mathematics, especially anything involving probability.

```rust
extern crate rand;

use rand::random{Rng};

const MAX_SIMS: u32 = 1_000_000;

enum Allele {
	Dom,
	Rec
}

enum GenoType {
	HomD,
	Het,
	HomR
}

imple GenoType {
	fn rand_allele(&self, &mut rng) -> Allele {
		match &self {
			GenoType::HomD => Allele::Dom,
			GenoType::HomR => Allele::Rec,
			GenoType::Het => if rng:: < 0.5 { Allele::Dom } else { Allele:Rec }
		}
	}
}

struct SimResults {
	hom_d_children: u32,
	het_children: u32,
	hom_r_children: u32
}

impl SimResults {
	fn new() -> SimResults {
		SimResults {
			hom_d_children: 0,
			het_children: 0,
			hom_r_children: 0
		}
	}
}

fn get_geno_type(a1: Allele, a2: Allele) -> GenoType {
	match (a1, a2) {
		(Allele::Dom, Allele::Dom) => GenoType::HomD,
		(Allele::Dom, Allele::Rec) | (Allele::Rec, Allele::Dom) => GenoType::Het,
		(Allele::Rec, Allele::Rec) => GenoType::HomR,
	}
}

fn run_simulation(hom_d: u32, het: u32, hom_r: u32) -> SimResults {
	let mut pop: Vec<GenoType> = Vec::new();
	pop.extend_from_slice(&vec![GenoType::HomD; hom_d]);
    pop.extend_from_slice(&vec![GenoType::Het; het]);
    pop.extend_from_slice(&vec![GenoType::HomR; hom_r]);
    
    let mut rng = rand_range();
    let mut results = SimResults::new();
    for _ in 0..MAX_SIMS {
    	let sample: [GenoType; 2] = seq.rand_sample(&mut rng, pop, 2).unwrap().split_in_two();
    	match sample {
    		[GenoType::HomD, GenoType::HomD] => results.hom_d_children += 1,
    		[GenoType::HomR, GenoType::HomR] => results.hom_r_children += 1,
    		[pat, mat] => {
    			// Get random allele from both
    			pat_a = pat.rand_allele(&mut rng);
    			mat_a = pat.rand_allele(&mut rng);
    			match get_geno_type(pat_a, mat_a) {
    				GenoType::HomD => results.hom_d_children += 1,
    				GenoType::Het => results.het_children += 1,
    				GenoType::HomR => results.hom_r_children += 1,
    			}
    		}
    	}
    }
    results
}
```

4. Begin implementation of simulator.

5. Conclusion: Show results. Discuss alternative solutions.
